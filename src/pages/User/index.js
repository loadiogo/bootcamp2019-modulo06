import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Star,
  Starred,
  OwnerAvatar,
  Author,
  Info,
  Title,
  Loading,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  constructor(props) {
    super(props);
    this.state = {
      stars: [],
      loading: true,
      page: 1,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.load();
  }

  load = async (page = 1) => {
    try {
      const { stars } = this.state;
      const { navigation } = this.props;
      const user = navigation.getParam('user');

      const response = await api.get(`/users/${user.login}/starred`, {
        params: { page },
      });

      this.setState({
        stars: page >= 2 ? [...stars, ...response.data] : response.data,
        loading: false,
        refreshing: false,
        page,
      });
    } catch (error) {
      console.tron.log(error);
    }
  };

  loadMore = () => {
    const { page } = this.state;
    const newPage = page + 1;

    this.load(newPage);
  };

  refreshList = () => {
    this.setState({
      refreshing: true,
    });

    this.load();
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading />
        ) : (
          <Star
            onRefresh={this.refreshList}
            refreshing={refreshing}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
