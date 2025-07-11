import UnderDevelopment from '../../Components/underDevelopment'
import PageLayout from '../../Containers/PageLayout'

export default function DashboardWrapper(): JSX.Element {
  return (
    <PageLayout>
       <UnderDevelopment
       heading="Under Development"
       title="This feature is under development"
       buttonText="Go to home"
       handleClick={()=>{}}
       showButton ={false}
       />
    </PageLayout>
  )
}
