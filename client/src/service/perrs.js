class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(answer));

      return answer;
    }
  }

  async setremoteDescription(answer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  async addIceCandidate(candidate) {
    if (this.peer) {
      await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  onIceCandidate(callback) {
    if (this.peer) {
      this.peer.onicecandidate = (event) => {
        if (event.candidate) {
          callback(event.candidate);
        }
      };
    }
  }

  onTrack(callback) {
    if (this.peer) {
      this.peer.ontrack = (event) => {
        callback(event.streams[0]);
      };
    }
  }

  async createDataChannel() {
    if (this.peer) {
      const dataChannel = this.peer.createDataChannel("chat");
      return dataChannel;
    }
  }

  async createOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }
}

export default new PeerService();
