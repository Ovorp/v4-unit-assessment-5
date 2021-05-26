INSERT INTO helo_users
(username, password, profile_pic)
VALUES
($1, $2, $3)
returning *;

    -- id serial PRIMARY KEY,
    -- username varchar(100) NOT NULL,
    -- password varchar(200) NOT NULL,
    -- profile_pic text