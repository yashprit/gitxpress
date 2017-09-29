import IView from './IView';

const template:string = `
  <div class="gitxpress__sidebar--settings" id="gxSettingsView">
    <div class="gitxpress--sidebar--settings__body">
      <div class="gitxpress__sidebar--settings__sync_body">
        <a class="gitxpress__sidebar--settings__sync_settings">Sync Plugin</a>
        <span class="gitxpress--checkbox">
          <input type="checkbox" id="gxFirebaseLinkStatus" checked=<% this.sync %>>
          <label data-on="ON" data-off="OFF"></label>
        </span>
      </div>
      <div class="gitxpress__sidebar--settings__token_body">
        <%if(!token){%>
          <label>
            Add Github Token
            <a href="https://github.com/settings/tokens/new">(Generate token)</a>
          </label>
          <input type="text" id="gxGithubTokenValue">
          <button id="gxGithubTokenSubmit">Add</button>
        <% } else { %>
          <span>Your Token is </span><% this.token %>
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

  componentWillRender(){}

  componentDidRender(){
    $('#gxHeaderArea').html(`<span class="gitxpress__sidebar--header--action">Settings</span>`);
    $('#gxFirebaseLinkStatus').prop('checked', this.props.state.sync);
    $('#gxGithubTokenSubmit').on("click", this.onSubmitToken);
    $('#gxFirebaseLinkStatus').on("click", this.onSyncEnabled);
  }

  onSubmitToken = ():void => {
    let tokenValue = $('#gxGithubTokenValue').val();
    this.props.addToken(tokenValue);
  }

  onSyncEnabled = ():void => {
    this.props.onSyncEnabled(!!!this.props.state.sync);
  }
}