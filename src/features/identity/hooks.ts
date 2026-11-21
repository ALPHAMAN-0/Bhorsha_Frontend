import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  createStaff,
  deactivateUser,
  fetchSession,
  getUser,
  listDrivers,
  listUsers,
  login,
  logout,
  register,
  updateUser,
  verifyDriver,
} from './api';
import type { DriverFilters, UpdateUserInput, UserFilters, VerifyDriverInput } from './types';

export const identityKeys = {
  session: ['session'] as const,
  users: ['users'] as const,
  userList: (filters: UserFilters) => ['users', 'list', filters] as const,
  user: (id: number) => ['users', id] as const,
  drivers: ['drivers'] as const,
  driverList: (filters: DriverFilters) => ['drivers', 'list', filters] as const,
};

/** Who is logged in, from this app's session cookie. */
export function useSession() {
  return useQuery({ queryKey: identityKeys.session, queryFn: fetchSession, staleTime: 5 * 60_000 });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: ({ user }) => {
      queryClient.clear();
      queryClient.setQueryData(identityKeys.session, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      router.replace('/login');
      router.refresh();
    },
  });
}

export function useRegister() {
  return useMutation({ mutationFn: register });
}

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: identityKeys.userList(filters),
    queryFn: () => listUsers(filters),
    placeholderData: keepPreviousData,
  });
}

export function useUser(id: number) {
  return useQuery({ queryKey: identityKeys.user(id), queryFn: () => getUser(id) });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: identityKeys.users }),
  });
}

export function useUpdateUser(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(id, input),
    onSuccess: (user) => {
      queryClient.setQueryData(identityKeys.user(id), user);
      void queryClient.invalidateQueries({ queryKey: identityKeys.users });
      // The gateway refreshed the session cookie if this was your own profile.
      void queryClient.invalidateQueries({ queryKey: identityKeys.session });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: identityKeys.users }),
  });
}

export function useDrivers(filters: DriverFilters) {
  return useQuery({
    queryKey: identityKeys.driverList(filters),
    queryFn: () => listDrivers(filters),
    placeholderData: keepPreviousData,
  });
}

export function useVerifyDriver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: VerifyDriverInput }) => verifyDriver(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: identityKeys.drivers }),
  });
}
