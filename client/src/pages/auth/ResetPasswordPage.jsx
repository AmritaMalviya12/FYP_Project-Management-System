import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { KeyRound, Loader } from "lucide-react";
import { resetPassword } from "../../store/slices/authSlice";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  
  const[errors,setErrors] = useState({});
  const[SearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const {isUpdatingPassword} = useSelector(state => state.auth);
  const token = SearchParams.get("token");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = "password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "password must be atleast 8 characters";
    }

     if (!formData.confirmPassword) {
      newErrors.password = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.password = "Confirm Password do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) {
        return;
      }

      try {
        await dispatch(
          resetPassword({
            token,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          })
        ).unwrap();

        navigate("/login");
      } catch (error) {
        setErrors({general:error || "failed to rest password. please try again.",
        });
      }
      
    };
  
  
  return <>

  <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <KeyRound className="w-8 h-8 text-white"></KeyRound>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Reset Password
            </h1>
            <p className="text-slate-600 mt-2">Enter Your new Password Below.</p>
          </div>

          {/* reset password form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              

              {/* password addrress */}
              <div>
                <label className="label">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input ${errors.password ? "input-error" : ""}`}
                  placeholder="Enter new password"
                ></input>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              {/* confirm Password */}
              <div>
                <label className="label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input ${errors.confirmPassword ? "input-error" : ""}`}
                  placeholder="Enter your Confirm Password"
                ></input>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              

              {/* final submit button */}
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingPassword ? (
                  <div className="flex justify-center items-center">
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Resetting...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">Remeber Your Password?
                  <Link to={"/login"} className="text-blue-600 hover:text-blue-500 font-medium"></Link>
                </p>
            </div>
          </div>
        </div>
      </div>
  </>;
};

export default ResetPasswordPage;
