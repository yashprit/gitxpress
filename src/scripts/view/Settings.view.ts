import IView from './IView';

const template:string = `
  <div class="gitxpress__sidebar--settings" id="gxSettingsView">
    <div class="gitxpress--sidebar--settings__body">
      <a id='gxFirebaseLinkStatus'>Sync Plugin</a>
      <div>
        <%if(!settings.token){%>
        <label>Add Github Token</label>
        <a href="https://github.com/settings/tokens/new">click here to genrate token</a>
        <input type="text" id="gxGithubTokenValue">
        <button id="gxGithubTokenSubmit">Add</button>
        <% } else { %>
        <span>Your Token is </span><% this.settings.token %>
        <% } %>
      </div>
    </div>
  </div>
`;

export default class Settings extends IView {

  private props:any;

  constructor(props:any) {
    super('#gxContentArea', template);
    this.props = props;
  }

  componentWillRender(){
    console.log("component will render");
  }

  componentDidRender(){
    $('#gxHeaderArea').html(`<span class="gitxpress__sidebar--header--action">Settings</span>`);
    $('#gxGithubTokenSubmit').on("click", this.onSubmitToken);
    $('#gxFirebaseLinkStatus').on("click", this.onSyncEnabled);
  }

  onSubmitToken = ():void => {
    let tokenValue = $('#gxGithubTokenValue').val();
    this.props.addToken(tokenValue);
  }

  onSyncEnabled = ():void => {
    this.props.onSyncEnabled();
  }
}