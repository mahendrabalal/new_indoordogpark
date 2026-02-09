import { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ToastProvider } from '@/contexts/ToastContext';
import NotFoundContent from './not-found-content';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found. Browse our indoor dog park directory or search for dog parks near you.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ToastProvider>
          <NotFoundContent />
        </ToastProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

