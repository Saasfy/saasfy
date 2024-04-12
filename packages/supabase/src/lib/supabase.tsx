import styles from './supabase.module.css';

/* eslint-disable-next-line */
export interface SupabaseProps {}

export function Supabase(props: SupabaseProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Supabase!</h1>
    </div>
  );
}

export default Supabase;
