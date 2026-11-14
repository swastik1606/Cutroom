import express from "express"
import { createClient, editClient, deleteClient } from "../controllers/clientsController.js"

export const apiRouter = express.Router()

//clients

apiRouter.post('/clients/add', createClient)
apiRouter.put('/clients/edit/:id', editClient)
apiRouter.delete('/clients/delete/:id', deleteClient)