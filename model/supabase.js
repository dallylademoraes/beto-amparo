import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cufzswdymzevdeonjgan.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1Znpzd2R5bXpldmRlb25qZ2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODIyMDcsImV4cCI6MjA1OTg1ODIwN30.MmDgDn3zAu3ThgudxS6SCZxm07qLKXIfaduu_iLI3x8'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
