defmodule BackendWeb.MarketstackController do
  use BackendWeb, :controller
  alias HTTPoison

  def fetch_data(conn, params) do
    # Extract parameters from the incoming request
    symbols = params["symbols"]
    date_from = params["date_from"]
    date_to = params["date_to"]

    # Use System.get_env to safely access the API key stored in an environment variable
    api_key = System.get_env("MARKETSTACK_API_KEY")

    # Construct the URL for the Marketstack API request
    url =
      "http://api.marketstack.com/v1/eod" <>
        "?access_key=#{api_key}" <>
        "&symbols=#{symbols}" <>
        "&date_from=#{date_from}" <>
        "&date_to=#{date_to}"

    # Make the HTTP request to the Marketstack API
    case HTTPoison.get(url) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} when is_binary(body) ->
        adj_close = parse_adj_close(body)
        # Wrap the value in a map to make it serializable by Jason
        data = %{adj_close: adj_close}
        json(conn, data)

      {:error, %HTTPoison.Error{reason: reason}} ->
        send_resp(conn, 500, "Failed to fetch data: #{reason}")
    end
  end

  def parse_adj_close(json_string) do
    case Jason.decode(json_string) do
      {:ok, %{"data" => data}} when is_list(data) and data != [] ->
        # Get the first item from the data list and extract adj_close
        %{"adj_close" => adj_close} = List.first(data)
        adj_close

      _ ->
        # Handle error or unexpected data format
        # You can return `nil`, an error message, or raise an exception depending on your needs
        nil
    end
  end
end
