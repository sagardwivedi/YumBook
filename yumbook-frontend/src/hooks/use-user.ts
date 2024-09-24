import { useQuery } from '@tanstack/react-query';

import { readUserOptions } from '~/client/@tanstack/react-query.gen';

const useUser = () => {
  const { data } = useQuery({
    ...readUserOptions(),
  });

  const isAuthenticated = !!data;

  return { isAuthenticated };
};

export default useUser;
