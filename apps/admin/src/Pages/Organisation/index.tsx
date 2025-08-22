import Details from "./Components/Details";
import List from "./List";
// import EditUser from "./components/EditUser";
// import UserProfile from "./components/UserProfile";

interface Props {
  page: string;
}

const Organisation = (props: Props) => {
  const { page } = props;

  return (
    <div>
      {page === "organisation" ? <List /> : page === "organisation-details" ? <Details /> : null}
    </div>
  );
};

export default Organisation;
