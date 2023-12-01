import Container from "@/app/components/Container"
import FormWrap from "../components/FormWrap"
import LoginForm from "./LoginForm"
import getCurrentUser from "@/actions/getCurrentUser"

const Login = async () => {

  const currentUser = await getCurrentUser();

  return (
    <Container>
        <FormWrap>
            <LoginForm currentUser={currentUser}/>
        </FormWrap>
    </Container>
  )
}

export default Login