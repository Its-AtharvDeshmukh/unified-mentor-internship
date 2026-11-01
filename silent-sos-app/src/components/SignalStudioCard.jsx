import Icon from "./Icon";
export default function SignalStudioCard({ navigate }) {
  return (
    <button className="signal-studio-card" onClick={() => navigate("delivery")}>
      <div className="studio-card-visual" aria-hidden="true">
        <span className="studio-small-node">
          <Icon name="fingerprint" size={20} />
        </span>
        <span className="studio-data-path">
          <i />
          <i />
          <i />
        </span>
        <span className="studio-small-node recipient-node">
          <Icon name="heart" size={20} />
        </span>
      </div>
      <div>
        <span className="eyebrow">MEET SIGNAL STUDIO</span>
        <h3>
          See the other side
          <br />
          of your quiet signal.
        </h3>
        <p>Explore the recipient preview and trace every step of a demo.</p>
      </div>
      <span className="studio-card-arrow">
        <Icon name="upRight" size={21} />
      </span>
    </button>
  );
}
