import signupImg from "../assets/Images/signup.webp"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <Template
     title="Join millions learning with StudyNotion"
    description1="Upgrade your skills."
    description2="Your future starts here."

      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup