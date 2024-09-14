import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Home } from './pages/Home/Home';
import { Register } from './pages/Register/Register';
import { Login } from './pages/Login/Login';
import { useDispatch, useSelector } from 'react-redux';
import { addToken } from './redux/token/tokenAction';

function App() {
	const dispatch = useDispatch();
	dispatch(addToken(localStorage.getItem('token')));
	const token = useSelector((state) => state.token.token);

	if (token) {
		return (
			<>
				<Header />
				<Routes>
					<Route path='/' element={<Home />} />
				</Routes>
			</>
		);
	} else {
		return (
			<>
				<Routes>
					<Route path='/' element={<Login />} />
					<Route path='/register' element={<Register />} />
				</Routes>
			</>
		);
	}
}

export default App;
