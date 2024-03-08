defmodule BackendWeb.MarketstackController do
  use BackendWeb, :controller
  alias HTTPoison

  def fetch_data(conn, params) do
    json(conn, "Wokring")
  end
end
