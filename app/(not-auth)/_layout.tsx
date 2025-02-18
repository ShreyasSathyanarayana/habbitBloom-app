import React from 'react';
import { Stack } from 'expo-router';

const NotAuthLayout = () => {
	return <Stack screenOptions={{ headerShown: false,animation:'slide_from_bottom' }} />;
};

export default NotAuthLayout;
