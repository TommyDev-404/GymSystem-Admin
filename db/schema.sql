USE gym_db;

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

    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    contact VARCHAR(11) NOT NULL,
    password VARCHAR(255) NOT NULL,
    hash_pass TEXT NOT NULL,

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
    total_claim INT NOT NULL,

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
    plan_id INT NOT NULL,
    status ENUM('Inactive','Active','Suspended') NOT NULL DEFAULT 'Active',
    is_activated BOOLEAN NOT NULL DEFAULT FALSE,
    points INT NOT NULL,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_members_plan
        FOREIGN KEY (plan_id)
        REFERENCES membership_plans(id)
        ON DELETE CASCADE,

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

CREATE TABLE member_bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    amount_due INT NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('Pending', 'Paid', 'Overdue') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_member_bills_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    paid_on DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_bill
        FOREIGN KEY (bill_id)
        REFERENCES member_bills(id)
        ON DELETE CASCADE
);

CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NULL,
    recepient_type ENUM('ADMIN', 'MEMBER') NOT NULL,
    type ENUM(
        'CHECK_IN',
        'PAYMENT',
        'REWARD_CLAIM',
        'REGISTER',
        'RENEWAL'
    ) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE SET NULL
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recepient_type ENUM('ADMIN', 'MEMBER') NOT NULL,
    recepient_id INT NOT NULL,

    type ENUM(
        'CHECK_IN',
        'PAYMENT',
        'REWARD',
        'WARNING',
        'REMINDER'
    ) NOT NULL,

    title VARCHAR(255) NOT NULL,
    message TEXT NULL,
    reference_id INT,
    reference_type VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE member_workouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    workout_name VARCHAR(150) NOT NULL,
    duration_minutes INT NOT NULL,
    calories_burned INT NOT NULL,
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
