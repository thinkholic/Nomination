import _ from 'lodash';
import { GET } from 'HttpMethods';
import { ElectionService } from 'Service';
import { createRoutes } from '../middleware/Router';
import { GET_ELECTION_BY_ID_SCHEME } from './schema/electionSchema';


const electionRouter = createRoutes();

export const initElectionRouter = (app) => {
	electionRouter(app, [
		{
			method: GET,
			path: '/elections/:electionId',
			schema: GET_ELECTION_BY_ID_SCHEME,
			handler: (req, res, next) => {
				return ElectionService.getElectionByIdWithTimelineData(req)
					.then( (result) => res.status(200).send(result))
					.catch( error => next(error));
			},
		},
	]);
};
