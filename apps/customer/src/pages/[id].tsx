import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setStorage } from '@ethos-frontend/utils';
import { CircularProgress } from '@mui/material';
import React from 'react';

const DynamicRoutePage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  useEffect(() => {
    if (id) {
      setStorage('orgId', id as string);
      router.replace('/');
    }
  }, [id, router]);

  return <CircularProgress />;
};

export default DynamicRoutePage;
