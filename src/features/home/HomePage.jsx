import React from 'react'

const HomePage = ({history}) => {
  return (
    <div>
          <div className="ui inverted vertical masthead center aligned segment">
            <div className="ui text container">
              <h1 className="ui inverted stackable header">
                <img
                  className="ui image massive"
                  src="/assets/logo.png"
                  alt="logo"
                />
                <div className="content">Your Events</div>
              </h1>
              <h2>Do whatever you want to do</h2>
              <div onClick={() => history.push('/events')} className="ui huge white inverted button">
                Get Started
                <i className="right arrow icon" />
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            Created By {' '}
            <a href="http://www.facebook.com/pronamvip" title="My Facebook">
              Trần Hải
            </a>{' '}
            from{' '}
            <a href="https://vi.wikipedia.org/wiki/%C4%90%C3%A0_N%E1%BA%B5ng" title="Đà Nẵng">
              Đà Nẵng
            </a>{' '}
           
          </div>
        </div>
  )
}

export default HomePage
