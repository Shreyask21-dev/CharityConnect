
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user',
  document_type VARCHAR(20),
  document_number VARCHAR(50),
  address TEXT,
  street VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  created_at VARCHAR(30) NOT NULL
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  amount INT NOT NULL,
  purpose VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  document_type VARCHAR(20) NOT NULL,
  document_number VARCHAR(50) NOT NULL,
  payment_id VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at VARCHAR(30) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
