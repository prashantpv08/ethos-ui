import { LoginForm, GridContainer } from '@ethos-frontend/components';
import { Heading, PrimaryButton } from '@ethos-frontend/ui';
import { useRestMutation } from '@ethos-frontend/hook';
import { API_URL, API_METHODS } from '@ethos-frontend/constants';
import { handleError } from '@ethos-frontend/utils';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../helpers/contants';

export default function Login(): JSX.Element {
  const navigate = useNavigate();

  const { mutate, isPending } = useRestMutation(
    API_URL.login,
    { method: API_METHODS.POST },
    {
      onSuccess: (res) => {
        const data = res.data;
        if (data?.accessToken) {
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('userData', JSON.stringify(data));
        }
        navigate(ROUTES.DASHBOARD);
      },
      onError: (err) => {
        handleError(err);
      },
    },
  );

  const onSubmit = (data: Record<string, unknown>) => {
    mutate(data);
  };

  return (
    <GridContainer columns={4} className="h-screen">
      <div className="col-start-1 col-end-5 sm:py-10 p-5 grid items-center">
        <div className="flex flex-col gap-5 w-full md:w-80 mx-auto">
          <Heading variant="h3" weight="bold">
            Sign In
          </Heading>
          <LoginForm onSubmit={onSubmit} loading={isPending} />
          <div className="flex justify-center">
            <PrimaryButton
              variant="text"
              onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
            >
              Forgot Password
            </PrimaryButton>
          </div>
        </div>
      </div>
    </GridContainer>
  );
}
