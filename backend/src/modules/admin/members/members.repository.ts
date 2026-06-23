import { env } from "../../../lib/env";
import { prisma } from "../../../lib/prisma";
import { transporter } from "../../../utils/mailer";
import { generateOTP } from "../../../utils/otp-generator";
import { createOtp } from "../auth/auth.repository";
import { CreateMemberDTO } from "./members.types";

export const createMember = async (data: CreateMemberDTO) => {
  const activationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const result = await prisma.$transaction(async (tx) => {
    // 1. Create member
    const member = await tx.members.create({
      data: {
        fullname: data.fullname,
        email: data.email,
        age: data.age,
        gender: data.gender,
        plan_id: data.plan_id,
      },
    });

    // 2. Create activation record
    await tx.member_activations.create({
      data: {
        member_id: member.id,
        activation_code: activationCode,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        is_used: false,
      },
    });

    // 3. Create billing record
    const plan = await tx.membership_plans.findFirst({
      where: { id: data.plan_id }
    });
    
    const now = new Date();
    
    let dueDate = new Date(now);
    
    if (plan?.duration_type === "Week") {
      dueDate.setDate(now.getDate() + plan.duration * 7);
    }
    
    if (plan?.duration_type === "Month") {
      dueDate.setMonth(now.getMonth() + plan.duration);
    }

    await tx.member_bills.create({
      data: {
        member_id: member.id,
        amount_due: Number(plan?.price), // or map from plan later
        due_date: dueDate, // or +30 days logic
        status: "Pending",
      },
    });

    return member;
  });

  // 4. Send email OUTSIDE transaction (important)
  await transporter.sendMail({
    from: `"Gym System" <${env.SMTP_USER}>`,
    to: data.email,
    subject: "Your Gym Activation Code",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Hello ${data.fullname},</h2>

        <p>Welcome to the gym system!</p>

        <p>Your activation code is:</p>

        <h1 style="letter-spacing: 4px; color: #16a34a;">
          ${activationCode}
        </h1>

        <p>This code will expire in 24 hours.</p>

        <hr />
        <small>If you did not request this, ignore this email.</small>
      </div>
    `,
  });

  return {
    success: true,
    message: "Member created successfully. Activation code sent.",
    data: {
      memberId: result.id,
      email: result.email,
    },
  };
};

export const resendActivationCode = async (email: string) => {
  const member = await prisma.members.findUnique({
    where: { email },
  });

  if (!member) {
    throw new Error("Member not found");
  }

  const code = generateOTP();

  console.log(member);
  const result = await prisma.$transaction(async (tx) => {
    const activation = await tx.member_activations.findFirst({
      where: { member_id: member.id },
      select: { id: true },
    });
    
    if (!activation) {
      throw new Error("Activation record not found");
    }
    
    await tx.member_activations.update({
      where: {
        id: activation.id,
      },
      data: {
        activation_code: code,
      },
    });

    return true;
  });
  
  console.log(result);

  // 3. Send email OUTSIDE transaction (important)
  await transporter.sendMail({
    from: `"Gym System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Activation Code",
    html: `
      <h2>Activation Code</h2>
      <p>Your new activation code is:</p>
      <h1>${code}</h1>
      <p>This code will expire in 5 minutes.</p>
    `,
  });

  return { message: "Activation code sent successfully" };
};

export const updateMember = async (id: number, data: any) => {
   await prisma.members.update({
     where: { id },
     data,
   });
 
   return {
     success: true,
     message: "Member updated successfully",
   };
 };

export const deleteMember = async(id: number) => {
  await prisma.members.delete({
    where: { id },
  });
   
  return {
   success: true,
   message: "Member removed successfully",
 };
};

export const findMemberById = (id: number) => {
  return prisma.members.findUnique({
    where: { id },
  });
};

export const getMembers = (filters: any) => {
  const { search, gender, status } = filters;

  return prisma.members.findMany({
    where: {
      ...(status && { status }),
      ...(gender && { gender }),

      ...(search && {
        fullname: {
          contains: search,
        },
      }),
    },
    select: {
      id: true,
      fullname: true,
      email: true,
      age: true,
      gender: true,
      plan_id: true,
      membership_plans: {
        select: { 
          plan_name: true
        }
      },
      status: true,
      join_date: true,
    },
    orderBy: {
      join_date: "desc",
    },
  });
};