CREATE TABLE helo_users (
    id serial PRIMARY KEY,
    username varchar(100) NOT NULL,
    password varchar(200) NOT NULL,
    profile_pic text
);

CREATE TABLE helo_posts (
    id serial PRIMARY KEY,
    title varchar(45) NOT NULL,
    content text,
    img text,
    author_id int REFERENCES helo_users(id),
    date_created timestamp
);