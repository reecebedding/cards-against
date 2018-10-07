import * as React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { ILobbyState } from '../../redux/store/IStoreStates';
import { AnyAction } from 'redux';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, Label, Col, Input, FormFeedback, Form, FormGroup } from 'reactstrap';
import { LobbyModel } from '../../models/Lobby';
import { createNewGame, loadLobbies } from '../../redux/actions/lobbyActions';
import { loadLobbyList, joinGame } from '../../socket/actions/lobbyActions';
import { LobbyList } from './LobbyList';

interface IProps {
    socket: SocketIOClient.Socket,
    lobbies: LobbyModel[],
    createNewGame: (socket: SocketIOClient.Socket, game: LobbyModel) => void,
    loadLobbies: (socket: SocketIOClient.Socket) => void,
    joinGame: (socket: SocketIOClient.Socket, id: string) => void
}

interface IState {
    showNewGame: boolean,
    newGame: LobbyModel
}

class Lobby extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            showNewGame: false,
            newGame: {
                name: '',
                _id: ''
            }
        }
    }

    componentDidMount(){
        this.props.loadLobbies(this.props.socket);
    }

    toggleShowNewGame = () => {
        this.setState({
            showNewGame: !this.state.showNewGame
        });
    }

    newGameConfirm = () => {
        this.props.createNewGame(this.props.socket, this.state.newGame)
        this.toggleShowNewGame();
    }

    newGameDecline = () => {
        this.toggleShowNewGame();
    }

    joinGame = (id: string) => {
        this.props.joinGame(this.props.socket, id);
    }

    validateNewGame = () => {
        return this.state.newGame.name != '';
    }

    handleTextChange = (event: any) => {
        let property = event.target.name;
        let value = event.target.value;

        this.setState((prevState) => ({
            ...prevState,
            newGame: {
                ...prevState.newGame,
                [property]: value
            }
        }));
    }

    render() {
        return (
            <div>
                <p>Lobby</p>
                <div>
                    <p>Games</p>
                    <LobbyList lobbies={this.props.lobbies} joinGame={ this.joinGame } />
                </div>
                <Button color="primary" onClick={this.toggleShowNewGame}>New Game</Button>

                <Modal isOpen={this.state.showNewGame} backdrop="static">
                    <ModalHeader>New Game</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup row>
                            <Label for="lobbyName">Game Name</Label>
                            <Input invalid={!this.validateNewGame()} value={this.state.newGame.name} name="name" onChange={this.handleTextChange}/>
                            <FormFeedback>Game name is required!</FormFeedback>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.newGameConfirm} disabled={!this.validateNewGame()}>Start</Button>
                        <Button color="secondary" onClick={this.newGameDecline}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state: any) {
    return {
        lobbies: state.lobby.lobbies
    };
}

function mapDispatchToProps(dispatch: ThunkDispatch<ILobbyState, null, AnyAction>) {
    return {
        createNewGame: (socket: SocketIOClient.Socket, game: LobbyModel) => dispatch(createNewGame(socket, game)),
        loadLobbies: (socket: SocketIOClient.Socket) => loadLobbyList(socket, dispatch),
        joinGame: (socket: SocketIOClient.Socket, id: string) => joinGame(socket, dispatch, id)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);