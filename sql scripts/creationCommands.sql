CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  post_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  content VARCHAR(300) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE followers (
  follower_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  following_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  followed_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE likes (
  like_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, post_id) 
);

CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  post_id INT REFERENCES posts(post_id) ON DELETE CASCADE,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  content VARCHAR(280) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);