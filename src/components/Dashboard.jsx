import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  Wrap,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import bgImg from "../assets/bg.jpg";
import { useEffect, useState } from "react";
import NoteCard from "./NoteCard";

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNotes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("no token found!");
        return;
      }
      try {
        const res = await axios.get(
          "https://simple-notes-backend.onrender.com/notes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotes(res.data.notes);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getNotes();
  }, [showModal]);

  const getNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("no token found!");
      return;
    }
    try {
      const res = await axios.get(
        "https://simple-notes-backend.onrender.com/notes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotes(res.data.notes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://simple-notes-backend.onrender.com/notes",
        {
          title,
          body,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        toast({
          title: "Note created.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "server error",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }

      setTitle("");
      setBody("");
      setShowModal(false);
    } catch (error) {
      toast({
        title: "Something went wrong! Please try again later.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      console.log(error);
      setShowModal(false);
    }
  };

  return (
    <Box
      bgImage={bgImg}
      bgSize="cover"
      minHeight="100vh"
      padding="20px"
      position="relative"
    >
      <Center mb="10px">
        <Button
          p="1rem 2rem"
          mt={4}
          onClick={() => setShowModal(true)}
          zIndex="1"
          colorScheme="yellow"
        >
          Add Tasks
        </Button>
      </Center>

      <Box width={"80%"} m={"auto"} mt={"2rem"}>
        {loading ? (
          <Box display={"flex"} justifyContent={"center"}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Box>
        ) : (
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(3, 1fr)",
            }}
            gap={6}
            m={"auto"}
            justifyContent={"center"}
          >
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                noteID={note._id}
                title={note.title}
                body={note.body}
                getNotes={getNotes}
              />
            ))}
          </Grid>
        )}
      </Box>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Task note</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Task Title:</FormLabel>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Body:</FormLabel>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                resize={"none"}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleCreateNote}>
              Submit Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;
