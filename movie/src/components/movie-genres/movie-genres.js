import React from 'react';

export const {
  Provider : MovieProvider,
  Consumer : MovieConsumer
} = React.createContext();

export default {
  MovieProvider,
  MovieConsumer
};