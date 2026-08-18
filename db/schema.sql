
CREATE TABLE membership_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration INT NOT NULL,
    duration_type ENUM('Week', 'Month', 'Day') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    username VARCHAR(255) NOT NULL UNIQUE,
    contact varchar(11),
    password VARCHAR(255) NOT NULL,
    hash_pass TEXT NOT NULL,
    profile varchar(255),
    role ENUM('ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER',

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE checkin_sessions (
    id VARCHAR(36) PRIMARY KEY,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE tutorials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    level ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    instructions TEXT NOT NULL,
    equipment JSON NOT NULL,
    muscles_targeted JSON NOT NULL,
    demo_images JSON NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE rewards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    points_required INT NOT NULL,
    category VARCHAR(255) NOT NULL,

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    age INT NOT NULL,
    gender ENUM('Male','Female') NOT NULL,
    is_activated BOOLEAN NOT NULL DEFAULT FALSE,
    points INT NOT NULL,
    referral_code varchar(255) not null UNIQUE,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_members_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE otp_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    code VARCHAR(10) NOT NULL,
    purpose ENUM('LOGIN', 'RESET_PASSWORD', 'VERIFY_EMAIL') NOT NULL,
    expiresAt DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_otp
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE reward_redemptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    reward_id INT NOT NULL,
    points_used INT NOT NULL,
    status ENUM(    
        'Pending',
        'Claimed',
        'Cancelled'
    ) DEFAULT 'Pending',

    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_reward_member_redeemed FOREIGN KEY(member_id)
        REFERENCES members(id) ON DELETE CASCADE,

    CONSTRAINT fk_reward_redeemed FOREIGN KEY(reward_id)
        REFERENCES rewards(id)
);

CREATE TABLE member_activations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    activation_code VARCHAR(10) NOT NULL,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_member_activations
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE
);

CREATE TABLE member_memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM(
        'Active',
        'Expired',
        'Cancelled'
    ) DEFAULT 'Active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_member_membership_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_member_membership_plan
        FOREIGN KEY (plan_id)
        REFERENCES membership_plans(id)
        ON DELETE RESTRICT
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    membership_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM(
        'Cash',
        'GCash',
        'Bank Transfer'
    ) NULL,

    payment_type ENUM(
        'Membership',
        'Renewal',
        'Upgrade',
        'Refund'
    ) NOT NULL,
    status ENUM(
        'Paid',
        'Refunded'
    ) DEFAULT 'Paid',
    description VARCHAR(255) NULL,
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_payment_membership
        FOREIGN KEY (membership_id)
        REFERENCES member_memberships(id)
        ON DELETE CASCADE
);

CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    session_id VARCHAR(36) NOT NULL,
    check_in_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PRESENT') DEFAULT 'PRESENT',

    CONSTRAINT fk_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_session
        FOREIGN KEY (session_id)
        REFERENCES checkin_sessions(id)
        ON DELETE CASCADE,

    UNIQUE KEY unique_member_session (member_id, session_id)
);

CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT NULL,
    recipient_type ENUM('ADMIN', 'MEMBER') NOT NULL,
    category ENUM(
        "PAYMENT",
        "MEMBERSHIP",
        "REWARD",
        "MEMBER",
        "ATTENDANCE",
        "PRICING",
        "WORKOUT"
    ),

    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_member_activities
        FOREIGN KEY (recipient_id)
        REFERENCES members(id)
        ON DELETE CASCADE
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT NULL,
    recipient_type ENUM('ADMIN', 'MEMBER') NOT NULL,
    category ENUM(
        "PAYMENT",
        "MEMBERSHIP",
        "REWARD",
        "MEMBER",
        "ATTENDANCE"
    ),
    type ENUM(
        "MEMBERSHIP_EXPIRED",
        "MEMBERSHIP_EXPIRING",
        "MEMBERSHIP_UPGRADE",
        "PAYMENT_RECORDED",
        "MEMBER_ADDED",
        "MEMBER_INACTIVE_3_DAYS",
        "MEMBER_INACTIVE_7_DAYS",
        "MEMBER_INACTIVE_14_DAYS",
        "REWARD_CLAIMED",
        "ATTENDANCE_POINTS",
        "REWARD_CANCELLED"
    ) NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    is_read BOOLEAN DEFAULT FALSE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_member_notifications
        FOREIGN KEY (recipient_id)
        REFERENCES members(id)
        ON DELETE CASCADE
);

CREATE TABLE member_workouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    workout_name VARCHAR(150) NOT NULL,
    duration_minutes INT NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_member_workouts
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE
);

CREATE TABLE member_workout_exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workout_id INT NOT NULL,
    exercise_name VARCHAR(150) NOT NULL,
    sets INT NOT NULL,
    reps INT NOT NULL,
    weight DECIMAL(6,2) NOT NULL,

    CONSTRAINT fk_member_workouts_exercises
        FOREIGN KEY (workout_id)
        REFERENCES member_workouts(id)
        ON DELETE CASCADE
);

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    content TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_posts_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE
);

CREATE TABLE post_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    image_url TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_post_images_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE
);

CREATE TABLE post_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    member_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_post_likes_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_post_likes_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_post_likes_member_post
        UNIQUE (post_id, member_id)
);

CREATE TABLE post_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    member_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_post_comments_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_post_comments_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE
);

CREATE TABLE fitness_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    goal_type ENUM(
        'LOSE_WEIGHT',
        'GAIN_WEIGHT'
    ) NOT NULL,
    status ENUM(
        'ACHIEVED',
        'ACTIVE'
    ) NOT NULL DEFAULT "ACTIVE",
    start_weight DECIMAL(5,2) NOT NULL,
    current_weight DECIMAL(5,2) NOT NULL,
    target_weight DECIMAL(5,2) NOT NULL,
    completed_at DATETIME NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_goal_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE
);

CREATE TABLE body_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    goal_id INT NOT NULL,
    member_id INT NOT NULL,
    previous_weight DECIMAL(5,2) NOT NULL,
    current_weight DECIMAL(5,2) NOT NULL,
    target_weight DECIMAL(5,2) NOT NULL,
    progress_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
    weight_change DECIMAL(5,2) NOT NULL DEFAULT 0,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_progress_goal
        FOREIGN KEY (goal_id)
        REFERENCES fitness_goals(id)
        ON DELETE CASCADE,


    CONSTRAINT fk_progress_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE
);

CREATE TABLE referrals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_id INT NOT NULL,
    referee_id INT NOT NULL,
    referrer_points INT NOT NULL,
    referee_points INT NOT NULL,

    referred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_referrer
        FOREIGN KEY (referrer_id)
        REFERENCES members(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_referee
        FOREIGN KEY (referee_id)
        REFERENCES members(id)
        ON DELETE CASCADE,

    UNIQUE (referee_id)
);