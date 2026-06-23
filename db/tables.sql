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


CREATE TABLE otp_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  code VARCHAR(10) NOT NULL,
  purpose ENUM('LOGIN', 'RESET_PASSWORD', 'VERIFY_EMAIL') NOT NULL,
  expiresAt DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_otp FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- members
CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    age INT,
    gender ENUM('Male','Female'),
    plan_id INT NOT NULL,
    status ENUM('Inactive','Active','Suspended') DEFAULT 'Inactive',
    is_activated BOOLEAN DEFAULT FALSE,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_members FOREIGN KEY (plan_id) REFERENCES membership_plans(id) ON DELETE CASCADE
);

-- activation codes
CREATE TABLE member_activations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    activation_code VARCHAR(10) NOT NULL,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_member_activations FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- members plan
CREATE TABLE membership_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration INT NOT NULL,
    duration_type ENUM('Week', 'Month') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- check in 
CREATE TABLE checkin_sessions (
    id VARCHAR(36) PRIMARY KEY,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- members attendance
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    session_id VARCHAR(36) NOT NULL,
    check_in_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PRESENT') DEFAULT 'PRESENT',

    CONSTRAINT fk_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,

    CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES checkin_sessions(id) ON DELETE CASCADE,

    UNIQUE KEY unique_member_session (member_id, session_id)
);

-- payments
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL
    paid_on DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_bill
        FOREIGN KEY (bill_id)
        REFERENCES member_bills(id)
        ON DELETE CASCADE
);

CREATE TABLE member_bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    amount_due DECIMAL(10,2) NOT NULL,
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