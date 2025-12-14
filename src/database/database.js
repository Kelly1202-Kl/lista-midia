import {Pool} from "pg"

const url = "postgresql://neondb_owner:npg_hORmEVGlI85Q@ep-autumn-cloud-acqd4dd0-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const database = new Pool({
    connectionString: url
})

 export default database;