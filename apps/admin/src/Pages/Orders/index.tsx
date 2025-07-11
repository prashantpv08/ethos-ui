import UnderDevelopment from '../../Components/underDevelopment'
import PageLayout from '../../Containers/PageLayout'
// import OrdersList from './OrdersList'

interface Props {
  page: string
}

const Orders = (props: Props) => {
  const { page } = props

  return (
    <PageLayout>
    <UnderDevelopment
      heading="Under Development"
      title="This feature is under development"
      buttonText="Go to home"
      handleClick={() => {}}
      showButton={false}
    />
  </PageLayout>
  )
}

export default Orders





// <PageLayout>
// <div>
//   {page === 'Orders' ? (
//     //  <OrdersList/>
//     <PageLayout>
//       <UnderDevelopment
//         heading="Under Development"
//         title="This feature is under development"
//         buttonText="Go to home"
//         handleClick={() => {}}
//         showButton={false}
//       />
//     </PageLayout>
//   ) : page === 'AddProduct' ? (
//     <>Add</>
//   ) : page === 'AddServices' ? (
//     <>Add</>
//   ) : (
//     <p>null</p>
//   )}
// </div>
// </PageLayout>