import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import { SerialPort, ReadlineParser } from 'serialport';
import dotenv from 'dotenv';
import fs from 'fs';

export {express, Server, cors, SerialPort, ReadlineParser, dotenv, fs};