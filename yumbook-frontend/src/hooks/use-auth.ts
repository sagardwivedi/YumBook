import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import {
  loginUserMutation,
  registerUserMutation,
} from '~/client/@tanstack/react-query.gen';
import { getErrorMessage } from '~/lib/utils';
import { useToast } from './use-toast';

/**
 * Custom hook for authentication-related mutations.
 * Handles user login and registration with appropriate side effects.
 *
 * @returns {Object} - Contains login and registration mutation objects.
 */
const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login mutation
  const loginMutation = useMutation({
    ...loginUserMutation(),
    onSuccess: ({ detail }) => {
      // Navigate to home page upon successful login
      navigate({ to: '/home' });
      toast({ title: 'Success', description: detail });
    },
    onError: (error) => {
      // Get and display the error message
      const errorMessage = getErrorMessage(error);
      toast({ title: 'Error', description: errorMessage });
    },
  });

  // Registration mutation
  const registerMutation = useMutation({
    ...registerUserMutation(),
    onSuccess: () => {
      // Navigate to login page upon successful registration
      navigate({ to: '/auth/login' });
    },
    onError: (error) => {
      // Get and display the error message
      const errorMessage = getErrorMessage(error);
      toast({ title: 'Error', description: errorMessage });
    },
  });

  return { loginMutation, registerMutation };
};

export default useAuth;
