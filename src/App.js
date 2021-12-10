import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  announcementSelector,
  deleteAction,
  deleteAnnouncement,
  getAnnouncements,
  postAnnouncement,
} from "./app/features/announcement/announcement.slice";
import "./style.css";

export default function App() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Home",
    location: "Baku",
  });

  const dispatch = useDispatch();
  const announcements = useSelector(announcementSelector.selectAll);
  const { status, posting, deleting } = useSelector(
    (state) => state.announcement
  );

  useEffect(() => {
    dispatch(getAnnouncements());

    console.log(announcementSelector, announcements);
  }, []);

  const createAnnouncement = (e) => {
    e.preventDefault();

    dispatch(postAnnouncement(formData));
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      type: "Home",
      location: "Baku",
    });
  };

  const handleDeleteAnnouncement = (id) => {
    // dispatch(deleteAction(id));
    dispatch(deleteAnnouncement(id));
  };

  return (
    <div className="container p-5 my-5">
      <form
        action=""
        method="POST"
        name="create-announcement-form"
        onSubmit={createAnnouncement}
      >
        <input
          className="form-control my-2"
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={({ target }) =>
            setFormData({
              ...formData,
              title: target.value,
            })
          }
          required
        />
        <input
          className="form-control my-2"
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={({ target }) =>
            setFormData({
              ...formData,
              description: target.value,
            })
          }
          required
        />
        <div className="d-flex align-items-center gap-3">
          <select
            className="form-control form-select"
            name="type"
            id=""
            required
            value={formData.type}
            onChange={({ target }) =>
              setFormData({
                ...formData,
                type: target.value,
              })
            }
          >
            <option value="Home">Home</option>
            <option value="Object">Object</option>
          </select>
          <select
            className="form-control form-select"
            name="location"
            id=""
            value={formData.location}
            onChange={({ target }) =>
              setFormData({
                ...formData,
                location: target.value,
              })
            }
            required
          >
            <option value="Baku">Baku</option>
            <option value="Lankaran">Lankaran</option>
            <option value="Gence">Gence</option>
            <option value="Absheron">Absheron</option>
            <option value="Shusha">Shusha</option>
            <option value="Sheki">Sheki</option>
          </select>
        </div>
        <div className="d-flex align-items-center gap-3 mt-3">
          <button
            className="btn btn-danger"
            type="reset"
            disabled={posting === "loading"}
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={posting === "loading"}
          >
            Create
          </button>
        </div>
      </form>

      <div className="my-4">
        <div className="row">
          {status === "loading" ? (
            <h4 className="text-white">Loading...</h4>
          ) : (
            announcements?.map((announcement) => (
              <div className="col-lg-4 my-3" key={announcement.id}>
                <div className="card">
                  <div className="card-header">{announcement.type}</div>
                  <div className="card-body">
                    <h5 className="card-title">{announcement.title}</h5>
                    <p className="card-text">{announcement.description}</p>
                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                      <div className="btn btn-info text-white">
                        {announcement.location}
                      </div>
                      <button
                        className="btn btn-danger"
                        disabled={deleting === "loading"}
                        onClick={() =>
                          handleDeleteAnnouncement(announcement.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
