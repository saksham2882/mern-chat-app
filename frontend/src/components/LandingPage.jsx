import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const buttonVariants = {
  hover: { scale: 1.1 },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-black relative">
      <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
        <motion.div
          className="bg-opacity-10 backdrop-blur-lg rounded-2xl p-10 max-w-3xl mx-auto border border-gray-600 shadow-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold leading-tight text-gray-100 text-center mb-6"
            variants={itemVariants}
          >
            Welcome to <span className="text-sky-300"> Chat App </span>
          </motion.h1>

          <motion.p
            className="text-lg text-gray-300 text-center mb-8"
            variants={itemVariants}
          >
            Connect instantly, chat seamlessly, and explore conversations.
          </motion.p>

          <motion.div
            className="flex justify-center gap-6"
            variants={itemVariants}
          >
            <motion.div variants={buttonVariants} whileHover="hover">
              <Link
                to="/login"
                className="btn bg-blue-600 text-white border-none hover:bg-blue-700 px-10 py-3 rounded-full"
              >
                Login
              </Link>
            </motion.div>

            <motion.div variants={buttonVariants} whileHover="hover">
              <Link
                to="/register"
                className="btn bg-transparent border-2 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white px-10 py-3 rounded-full"
              >
                Register
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </Tilt>
    </div>
  );
};

export default LandingPage;