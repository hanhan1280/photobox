import React, { useState, useContext, useEffect } from "react";
import { getAllUsers, addFriend, getFriends, deleteFriend } from "../../actions/userUtils";
import { ErrorContext } from "../../contexts/ErrorContext";
import { Link, useHistory } from "react-router-dom";
import Tooltip from '@material-ui/core/Tooltip';

const Friends = () => {
    const { setError } = useContext(ErrorContext);
    const [allUsers, setAllUsers] = useState([]);
    const [friends, setAllFriends] = useState([]);
    const [search, setSearch] = useState("");
    const history = useHistory();

    useEffect(() => {
        getAllUsers(setError).then(users => setAllUsers(users));
        getFriends(setError).then(users => setAllFriends(users)).catch(err => console.log(err));
    }, [setError]);

    const onAddFriend = async (userId, follow) => {
        if (follow) {
            await deleteFriend(userId, setError);
        }
        else {
            await addFriend(userId, setError);
        }
        getFriends(setError).then(users => setAllFriends(users));
    }

    const isFollower = (userId) => {
        return friends.some(friend => friend._id === userId)
    }

    const goTo = (userId, follow) => {
        if (follow) {
            history.push(`/dashboard/${userId}`);
        }
    }

    return (
        <div className="container valign-wrapper">
            <div className="row" style={{ marginTop: 20 }}>
                <h4>
                    Find <b>Friends</b> Here
                </h4>
                <div className="input-field col s12">
                    <i className="material-icons prefix">search</i>
                    <input
                        onChange={e => setSearch(e.target.value)}
                        value={search}
                        id="search"
                        type="text"
                        className="validate"
                    />
                    <label htmlFor="search">Search Friends</label>
                </div>
                {allUsers ?
                    allUsers.filter(user => {
                        if (search && (user.name.search(search) !== -1 || user.email.search(search) !== -1)) {
                            return user;
                        }
                        else if (!search) return user;
                        return null;
                    }).map((user, i) => {
                        const follow = isFollower(user._id);
                        return (
                            <div className="card col s12" key={i}>
                                <div className="card-content">
                                    <Tooltip title={follow ? 'Go to profile' : 'Follow to check out photos'} aria-label="goto" placement="left-start" arrow>
                                        <div className="left circle hoverable" style={{ cursor: "pointer", width: 40, height: 40, position: "relative", marginRight: 10 }}>
                                            <div onClick={() => goTo(user._id, follow)} className="circle valign-wrapper center-align" style={{ zIndex: 5, position: "absolute", width: 40, height: 40, backgroundColor: "#42424280" }}>
                                                <p className="white-text" style={{ width: 40}}>+{user.imageLen}</p>
                                            </div>
                                            <img className="circle" style={{ width: 40, height: 40, objectFit: "cover", cursor: "pointer", marginRight: 5 }} src={user.profile?user.profile.url:""} alt="" />
                                        </div>
                                    </Tooltip>
                                    <p className="grey-text text-darken-3"><b>{user.name}</b></p>
                                    <p className="blue-text text-lighten-1" style={{ display: "inline-block" }}>@{user.email}</p>
                                    <button onClick={() => onAddFriend(user._id, follow)}
                                        style={{
                                            zIndex: 5,
                                        }}
                                        className={`btn-flat btn-small ${!follow ? 'blue accent-3' : 'red accent-2'} white-text right`}>
                                        {follow ? "remove Friend" : "add Friend"}
                                        {follow ? null : <i className="white-text material-icons right">group_add</i>}
                                    </button>
                                </div>
                            </div>
                        )
                    }) : null
                }
                <div className="col s12 center-align">
                    <Link
                        style={{
                            borderRadius: "3px",
                            letterSpacing: "1.5px",
                            marginTop: "1rem"
                        }}
                        to="/dashboard"
                        className="btn-flat waves-effect btn-large white"><i className="material-icons left">keyboard_backspace</i>
                            Back to Dashboard
                        </Link>
                </div>
            </div>
        </div>

    );
};

export default Friends;