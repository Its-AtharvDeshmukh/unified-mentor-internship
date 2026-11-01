import Icon from "../Icon";

export default function OverviewPractice({ navigate }) {
  return (
    <section className="ov-practice cw-practice" data-overview-reveal>
      <div className="cw-practice-top">
        <span className="cw-section-index">
          A LITTLE PRACTICE GOES A LONG WAY
        </span>
        <span aria-hidden="true">✳</span>
      </div>
      <div className="cw-signal-preview" aria-hidden="true">
        <span>
          <Icon name="fingerprint" size={24} />
          <small>YOU</small>
        </span>
        <div>
          <i />
          <i />
          <i />
          <Icon name="arrow" size={16} />
        </div>
        <span>
          <Icon name="users" size={24} />
          <small>YOUR CIRCLE</small>
        </span>
      </div>
      <h3>
        Know your signal.
        <br />
        <span>Feel more familiar.</span>
      </h3>
      <p>Follow a demo from the first tap to a trusted contact’s response.</p>
      <button onClick={() => navigate("delivery")}>
        <span>Explore Signal Studio</span>
        <Icon name="upRight" size={19} />
      </button>
    </section>
  );
}
