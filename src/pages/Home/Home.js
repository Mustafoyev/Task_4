import React, { useEffect, useState } from 'react';
import './home.scss';
import { db } from '../../firebase.config';
import {
	collection,
	getDocs,
	updateDoc,
	doc,
	deleteDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { TbLockFilled } from 'react-icons/tb';
import { TbLockOpen2 } from 'react-icons/tb';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdOutlineIndeterminateCheckBox } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { removeToken } from '../../redux/token/tokenAction';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
	const [users, setUsers] = useState([]);
	const [userAuth, setUserAuth] = useState({});
	const [selectedUserId, setSelectedUserId] = useState([]);
	const usersCollection = collection(db, 'users');
	const dispatch = useDispatch();
	const navigate = useNavigate();

	onAuthStateChanged(auth, (currentUser) => {
		setUserAuth(currentUser);
	});

	const getUsers = async () => {
		const data = await getDocs(usersCollection);
		setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
	};

	useEffect(() => {
		getUsers();
	}, []);

	const handleChange = async (id) => {
		const data = await getDocs(usersCollection);
		setSelectedUserId(
			data.docs
				.map((doc) => ({ ...doc.data(), id: doc.id }))
				.filter((doc) => doc.id == id),
		);
	};

	const handleBlock = async () => {
		const updatedData = doc(db, 'users', selectedUserId[0].id);
		const newData = { status: false };
		await updateDoc(updatedData, newData);
		getUsers();
	};

	const handleUnblock = async () => {
		const updatedData = doc(db, 'users', selectedUserId[0].id);
		const newData = { status: true };
		await updateDoc(updatedData, newData);
		getUsers();
	};

	const handleDelete = async () => {
		const updatedData = doc(db, 'users', selectedUserId[0].id);
		await deleteDoc(updatedData);
		if (selectedUserId[0].id == userAuth.uid) {
			localStorage.removeItem('token');
			dispatch(removeToken(''));
			navigate('/register');
		} else {
			getUsers();
		}
	};

	return (
		<div>
			<h1 className='mt-3 mb-3 text-center'>Hello {userAuth?.displayName}</h1>
			<div className='home-wrapper'>
				<div className='mb-4'>
					<button onClick={handleBlock} className='btn btn-warning me-2'>
						Block <TbLockFilled size={20} />
					</button>
					<button onClick={handleUnblock} className='btn btn-primary me-2'>
						<TbLockOpen2 />
					</button>
					<button onClick={handleDelete} className='btn btn-danger'>
						<RiDeleteBin6Fill />
					</button>
				</div>

				<table>
					<thead>
						<tr>
							<th>
								<MdOutlineIndeterminateCheckBox />
							</th>
							<th>Name</th>
							<th>Email</th>
							<th>Last login</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user?.id}>
								<td>
									<input
										onChange={() => handleChange(user?.id)}
										className='form-check-input'
										id={user?.id}
										type='checkbox'
									/>
								</td>
								<td className={user?.status ? 'opacity-100' : 'opacity-25'}>
									{user?.name} {user?.lastName}
								</td>
								<td className={user?.status ? 'opacity-100' : 'opacity-25'}>
									{user?.email}
								</td>
								<td className={user?.status ? 'opacity-100' : 'opacity-25'}>
									{userAuth
										? userAuth?.metadata?.lastSignInTime
										: user?.lastLogin}
								</td>
								<td className={user?.status ? 'opacity-100' : 'opacity-25'}>
									{user?.status ? 'Active' : 'Block'}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
