import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Divider,
  Alert,
} from '@heroui/react';
import { Context, type IStoreContext } from '@/store/StoreProvider';
import { MAIN_ROUTE } from '@/utils/consts';

const AuthPage = observer(() => {
  const { user } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await user.login(email, password);
      navigate(MAIN_ROUTE);
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Ошибка входа. Проверьте данные.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelegramAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      const tg = window?.Telegram?.WebApp;
      const initData = tg?.initData;
      
      if (initData) {
        await user.telegramLogin(initData);
        navigate(MAIN_ROUTE);
      } else {
        setError('Telegram WebApp не доступен');
      }
    } catch (error: any) {
      console.error('Telegram auth error:', error);
      setError(error.response?.data?.message || 'Ошибка авторизации через Telegram');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 pb-0">
          <div className="flex items-center justify-center mb-4">
            <img src="/LOGO.svg" alt="Logo" className="h-12" />
          </div>
          <h1 className="text-2xl font-bold text-center">Админ панель</h1>
          <p className="text-small text-default-500 text-center">
            Войдите в систему для управления контентом
          </p>
        </CardHeader>
        
        <CardBody className="gap-4">
          {error && (
            <Alert color="danger" variant="flat">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
              isDisabled={isLoading}
              variant="bordered"
            />
            
            <Input
              type="password"
              label="Пароль"
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              isDisabled={isLoading}
              variant="bordered"
            />
            
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
              isDisabled={!email || !password}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>

          <div className="flex items-center gap-4">
            <Divider className="flex-1" />
            <span className="text-small text-default-500">или</span>
            <Divider className="flex-1" />
          </div>

          <Button
            color="secondary"
            variant="bordered"
            size="lg"
            onClick={handleTelegramAuth}
            isLoading={isLoading}
            startContent={
              !isLoading && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.61 7.59c-.12.56-.44.7-.89.44l-2.46-1.81-1.19 1.15c-.13.13-.24.24-.49.24l.18-2.56 4.57-4.13c.2-.18-.04-.28-.31-.1l-5.64 3.55-2.43-.76c-.53-.16-.54-.53.11-.79l9.57-3.69c.44-.16.83.1.69.79z"/>
                </svg>
              )
            }
          >
            {isLoading ? 'Авторизация...' : 'Войти через Telegram'}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
});

export default AuthPage;
