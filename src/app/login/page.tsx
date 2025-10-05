import type { Metadata } from 'next';
import LoginForm from '../../components/LoginForm';

export const metadata: Metadata = {
  title: 'Login - hlola GRC Platform',
  description: 'Sign in to your hlola account to manage compliance, risk, and governance.',
};

export default function LoginPage() {
  return <LoginForm />;
}
