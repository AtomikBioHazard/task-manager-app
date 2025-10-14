-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable additional extensions that might be useful
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant necessary permissions to dev_user
GRANT ALL PRIVILEGES ON DATABASE task_manager_dev TO dev_user;

-- Grant schema permissions
GRANT ALL PRIVILEGES ON SCHEMA public TO dev_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dev_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dev_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO dev_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO dev_user;