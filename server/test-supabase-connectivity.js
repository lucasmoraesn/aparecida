import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
if (!process.env.SUPABASE_URL) {
    dotenv.config();
}

console.log('Testing Supabase connection...');
console.log('URL:', process.env.SUPABASE_URL);

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

try {
    const { data, error } = await supabase.from('business_plans').select('count', { count: 'exact' });
    if (error) {
        console.error('Supabase Error details:', error);
    } else {
        console.log('Success! Data count:', data);
    }
} catch (err) {
    console.error('Fetch Failed Exception:', err);
    if (err.cause) {
        console.error('Cause:', err.cause);
    }
}
