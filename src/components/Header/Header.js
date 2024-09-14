import React from 'react';
import './header.scss';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeToken } from '../../redux/token/tokenAction';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSignOut = () => {
		localStorage.removeItem('token');
		dispatch(removeToken(''));
		navigate('/');
	};

	return (
		<header className='site-header'>
			<nav className='site-header-nav'>
				<div
					className='navbar bg-dark border-bottom border-body'
					data-bs-theme='dark'>
					<div className='container-fluid'>
						<Link className='site-header-link' to={'/'}>
							Users
						</Link>

						<button onClick={handleSignOut} className='btn btn-primary'>
							Log Out
						</button>
					</div>
				</div>
			</nav>
		</header>
	);
};
