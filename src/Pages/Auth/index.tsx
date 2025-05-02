import "react-toastify/dist/ReactToastify.css";

import { Cheff1 } from "../../components/Assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";

import { motion } from "framer-motion";
import { useStateValue } from "../../context/StateProvider";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { fetchUserCartData } from "../../utils/functions";

const ProviderAuth = () => {
  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const AUTH = async ({ provider }: { provider: string }) => {
    if (!user) {
      toast.warn(`${provider} authentication is not available yet`, {
        autoClose: 2000,
        icon: (
          <MdOutlineNotificationsActive className="text-yellow-500 text-xl" />
        ),
        toastId: provider,
      });
      // 注意：Supabase OAuth流程将在实际项目中实现
    }
  };
  
  return (
    <div className="flex items-center justify-center gap-5  text-center">
      <motion.p
        whileHover={{ scale: 1.1 }}
        className="flex items-center w-36 h-10 bg-white justify-center rounded text-headingColor px-5 cursor-pointer shadow-sm hover:bg-slate-100"
        onClick={() => AUTH({ provider: "github" })}
      >
        <BsGithub className="text-xl w-5 mr-1" />
        <span>Github</span>
      </motion.p>
      <motion.p
        whileHover={{ scale: 1.1 }}
        className="flex items-center w-36 h-10 bg-white justify-center rounded text-headingColor px-5 cursor-pointer shadow-sm hover:bg-slate-100"
        onClick={() => AUTH({ provider: "google" })}
      >
        <FcGoogle className="text-xl w-5 mr-1" />
        <span>Google</span>
      </motion.p>
    </div>
  );
};

export const ImageBox = () => {
  return (
    <div className="hidden md:w-8/12 lg:w-6/12 mb-12 md:mb-0 md:flex ">
      <motion.img
        whileHover={
          {
            rotate: [0, -10, 10, -10, 0],
            // duration: 0.5,
          }
        }
        src={Cheff1}
        className="w-96 cursor-pointer"
        alt="logo-login"
      />
    </div>
  );
};

export default ProviderAuth;
