import { v4 } from "uuid";
import { statusOpt, typeOpt } from "../constants";
import axios from "axios";
import { toast } from "react-toastify";
import {
  createJob,
  setError,
  setJobs,
  setLoading,
} from "../redux/slices/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AddJob = () => {
  const state = useSelector((store) => store.jobSlice);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setLoading());
    axios
      .get("http://localhost:4000/jobs")
      .then((res) => dispatch(setJobs(res.data)))
      .catch((err) => dispatch(setError(err.message)));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newJob = Object.fromEntries(formData.entries());

    //Tarih ve Id Ekleme

    newJob.id = v4();
    newJob.date = new Date().toLocaleDateString();

    axios
      .post("http://localhost:4000/jobs", newJob)
      .then(() => {
        toast.success("Yeni bir is eklendi");
        dispatch(createJob(newJob));
        navigate("/");
      })
      .catch(() => {
        toast.warn("ekleme isleminde sorun olustu");
      });
  };

  const removeDuplicates = (key) => {
    const arr = state.jobs.map((i) => i[key]);

    const filtred = arr.filter((value, index) => arr.indexOf(value) === index);

    return filtred;
  };

  return (
    <div className="add-page">
      <section className="add-sec">
        <h2>Yeni İş Ekle</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Pozisyon</label>
            <input list="positions" name="position" type="text" required />
            <datalist id="positions">
              {removeDuplicates("position").map((i) => (
                <option value={i} />
              ))}
            </datalist>
          </div>

          <div>
            <label>Şirket</label>
            <input list="companies" name="company" type="text" required />

            <datalist id="companies">
              {removeDuplicates("company").map((i) => (
                <option value={i} />
              ))}
            </datalist>
          </div>

          <div>
            <label>Lokasyon</label>
            <input list="locations" name="location" type="text" required />
            <datalist id="locations">
              {removeDuplicates("location").map((i) => (
                <option value={i} />
              ))}
            </datalist>
          </div>

          <div>
            <label>Durum</label>
            <select name="status" required>
              <option value={""} hidden>
                Seçiniz
              </option>
              {statusOpt.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Tür</label>
            <select name="type" required>
              <option value={""} hidden>
                Seçiniz
              </option>
              {typeOpt.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button className="btn" type="button">
              <span>İş Ekle</span>
              <div id="container-stars">
                <div id="stars"></div>
              </div>

              <div id="glow">
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddJob;
