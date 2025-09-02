"use client";
import {
  Box,
  Flex,
  Text,
  Center,
  Image,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  InputRightAddon,
  InputGroup,
  Link,
  useToast,
  Icon,
  InputRightElement,
  IconButton,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import Layout from "../../src/components/Auth/Layout";
import { useRouter, usePathname } from "next/navigation";
import NextLink from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IoEye, IoEyeOff, IoLogoGoogle } from "react-icons/io5";
import WIPAlert from "../../src/components/Web/WIPAlert";

export default function Signup({ user }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [view, setView] = useState("sign-up");
  const router = useRouter();
  const supabase = createClientComponentClient();
  const toast = useToast();
  const pathname = usePathname();
  const {isOpen, onOpen, onClose} = useDisclosure()

  useEffect(() => {
    if (user) {
      router.push("/app/chat");
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      console.log(data);
      if (
        data.user &&
        data.user.identities &&
        data.user.identities.length === 0
      ) {
        alert("User already exists");
        return;
      } else if (error) {
        alert(error.message);
        return;
      }

      // If there is no error during sign-up, proceed with setView('check-email')
      setView("check-email");
    } catch (error) {
      // Handle the error here, you can show an error message or perform any other actions.
      if (error instanceof Error) {
        console.log("Error during sign-up:", error.message);
      }
      // You may want to set an error state here if you want to display an error message to the user.
    }
  };
  // router.push('/')
  // router.refresh()

  return (
    <Layout>
      <Flex
       direction="column"
       h="full"
       bg={'#14171D'}
       w={{ base: "full", lg: "40%" }}
       zIndex={2}
       position={"fixed"}
       overflowY={"scroll"}
       css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: "white",
          borderRadius: '24px',
        },
      }}
      >

        <Flex
          justify="flex-start"
          onClick={() => router.push("/")}
          cursor="pointer"
          align="center"
          py={{ base: "10px", lg: "20px" }}
          ml={{ base: "20px", lg: "50px" }}
          gap={1}
          w="11em"
        >
          <Image
            src="/logowhite.png"
            alt="Lecture mate logo"
            w={6}
            pointerEvents="none"
          />
          <Text fontWeight="black" fontSize={18}>
            Lecture Mate
          </Text>
        </Flex>

        <Flex
          direction="column"
          h={{ base: "full", lg: "80%" }}
          w={"full"}
          py={5}
          px={{ base: "20px", lg: "10%" }}
        >
          <Text mt={10} fontSize={"1.5rem"} fontWeight={600}>
            Get Started
          </Text>
          <Text fontSize={"1.125rem"} fontWeight={500}>
            Create your account
          </Text>

{/*           <Flex
            mt={5}
            p="2"
            w="100%"
            border="1px solid #53AF28"
            cursor="pointer"
            _hover={{ bg: "#53AF2820" }}
            justify="center"
            align="center"
            gap={2}
            borderRadius="6px"
            onClick={onOpen}
          >
            <Icon as={IoLogoGoogle} />
            <Text>Continue with Google</Text>
          </Flex> */}
          <WIPAlert isOpen={isOpen} onClose={onClose} />
          <Flex fontSize={"1rem"} direction={"column"} mt={10}>
            <Formik
              initialValues={{ username: "", email: "", country: "", institute: "", role: "", password: "" }}
              onSubmit={async (values, actions) => {
                const { data, error } = await supabase.auth.signUp({
                  email: values.email,
                  password: values.password,
                  options: {
                    data: {
                      username: values.username,
                      country: values.country,
                      institute: values.institute,
                      role: values.role,
                    },
                    emailRedirectTo: `${location.origin}/auth/callback`,
                  },
                });

                const userData: any = data
                console.log(userData)

                if (
                  userData.user &&
                  userData.user.identities &&
                  userData.user.identities.length === 0
                  ) {
                    console.log("Use profile already exists")
                    actions.setSubmitting(false);
                    toast({
                      title: "Error creating user",
                      description: `A user already exists with these details`,
                      status: "error",
                      variant: "left-accent",
                      duration: 5000,
                      isClosable: true,
                      position: "top-right",
                    });
                    actions.resetForm();                   
                } else if (error?.message === "Failed to fetch") {
                  actions.setSubmitting(false);
                  toast({
                    title: "Network Error",
                    description: `Check your internet connection`,
                    status: "error",
                    variant: "left-accent",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                  });
                  actions.resetForm();
                }                                
                else if (userData && !error) {
                  console.log("It was a success")
                  setView("check-email");
                  actions.setSubmitting(false);
                  toast({
                    title: "Congratulations🎉🎉",
                    description: `Your Account has been created`,
                    status: "success",
                    variant: "left-accent",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                  });
                  setTimeout(() => {
                    router.push('/verify-email')
                  }, 600)
                }
                else {
                  actions.setSubmitting(false);
                  toast({
                    title: "Error creating user",
                    description: `Oops, we've ran into an error. Try again later`,
                    status: "error",
                    variant: "left-accent",
                    duration: 5000,
                    isClosable: true,
                    position: "top-right",
                  });
                  actions.resetForm();
                }
              }}
            >
              {(props) => (
                <Form>
                  <Field name="username">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={
                          form.errors.username && form.touched.username
                        }
                      >
                        <FormLabel>Username</FormLabel>
                        <Input
                          {...field}
                          focusBorderColor="#53AF28"
                          placeholder="username"
                          type="text"
                          variant="outline"
                          border={"2px"}
                          borderColor={"#2B2C2D"}
                          bgColor={"#252525"}
                          mb={2}
                          w={"100%"}
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="email">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                      >
                        <FormLabel>Email Address</FormLabel>
                        <Input
                          {...field}
                          focusBorderColor="#53AF28"
                          placeholder="you@example.com"
                          type="email"
                          variant="outline"
                          border={"2px"}
                          borderColor={"#2B2C2D"}
                          bgColor={"#252525"}
                          mb={2}
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Flex direction={"row"} gap={4}>
                    <Field name="country">
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={
                            form.errors.country && form.touched.country
                          }
                        >
                          <FormLabel>Country</FormLabel>
                          <Input
                            {...field}
                            focusBorderColor="#53AF28"
                            placeholder="e.g United States"
                            type="text"
                            variant="outline"
                            border={"2px"}
                            borderColor={"#2B2C2D"}
                            bgColor={"#252525"}
                            mb={2}
                          />
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="role">
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={
                            form.errors.role && form.touched.role
                          }
                        >
                          <FormLabel>Role</FormLabel>
                          <Input
                            {...field}
                            focusBorderColor="#53AF28"
                            placeholder="e.g Student"
                            type="text"
                            variant="outline"
                            border={"2px"}
                            borderColor={"#2B2C2D"}
                            bgColor={"#252525"}
                            mb={2}
                          />
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Flex>

                  <Field name="institute">
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={
                            form.errors.institute && form.touched.institute
                          }
                        >
                          <FormLabel>Institute</FormLabel>
                          <Input
                            {...field}
                            focusBorderColor="#53AF28"
                            placeholder="e.g School"
                            type="text"
                            variant="outline"
                            border={"2px"}
                            borderColor={"#2B2C2D"}
                            bgColor={"#252525"}
                            mb={2}
                          />
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  
                  <Field name="password">
                    {({ field, form }: any) => (
                      <FormControl
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                      >
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                          <Input
                            {...field}
                            focusBorderColor="#53AF28"
                            bgColor={"#252525"}
  
                            placeholder="••••••••"
                            type={show === false ? "password" : "text"}
                            variant="outline"
                            border={"2px"}
                            borderColor={"#2B2C2D"}
                          />
                          <InputRightElement>
                            <IconButton
                              icon={show === false ? <IoEye color="white"/> : <IoEyeOff color="white"/>}
                              aria-label="show-hide password"
                              onClick={() => setShow(!show)}
                              size="sm"
                              bgColor={"#2B2C2D"}
                              _hover={{bgColor:"#252525"}}
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>
                          {form.errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  {/* <Flex align="center">
                    <Text
                      color="gray.500"
                      fontSize={12}
                      fontWeight={500}
                      mt={2}
                      mb={10}
                    >
                      Forgot password?{" "}
                      <NextLink href="#" passHref>
                        <Link color="#53AF28">
                          <strong>Reset it</strong>
                        </Link>
                      </NextLink>
                    </Text>
                  </Flex> */}

                  <Button
                    mt={10}
                    w="full"
                    bg="#016706"
                    color="white"
                    _hover={{ bg: "#008F06" }}
                    isLoading={props.isSubmitting}
                    isDisabled={!props.isValid || !props.dirty ? true : false}
                    type="submit"
                  >
                    Sign Up
                  </Button>
                </Form>
              )}
            </Formik>
            <Flex gap={2} mt={{ base: 6, lg: 4 }} align="center" mb={"30px"}>
              <Text fontSize={{ base: "12px" }}>Already have an account?</Text>
              <Button
                display="inline"
                variant="link"
                color="#016706"
                fontSize={{ base: "12px" }}
                onClick={() =>
                  router.push(pathname === "/signin" ? "/signup" : "/signin")
                }
              >
                {pathname === "/signin"
                  ? "Create an Account"
                  : "Sign in to your account"}
              </Button>
            </Flex>
          </Flex>
        </Flex>

      </Flex>






      <Image
        src="/lmglow.png"
        w="75%"
        pos="absolute"
        top="30%"
        left="40%"
        pointerEvents="none"
      />      
    </Layout>
  );
}


