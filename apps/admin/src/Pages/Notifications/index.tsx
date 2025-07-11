import UnderDevelopment from "../../Components/underDevelopment";
import PageLayout from "../../Containers/PageLayout";
import AddNotification from "./components/AddNotification";

interface Props {
  page: string;
}

const Notifications = (props: Props) => {
  const { page } = props;

  return (
    <PageLayout>
      <UnderDevelopment
        heading="Under Development"
        title="This feature is under development"
        buttonText="Go to home"
        handleClick={() => {}}
        showButton={false}
      />
      {/* <div>
     {page === 'Notifications' ? (
       <NotificationsList/>
      ) :
        page === 'AddNotification' ? (
          <AddNotification/>
        ) :  (
          <p>null</p>
        )}
     </div> */}
    </PageLayout>
  );
};

export default Notifications;
