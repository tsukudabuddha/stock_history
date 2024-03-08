defmodule BackendWeb.MarketstackController do
  use BackendWeb, :controller
  alias HTTPoison

  def fetch_data(conn, params) do
    symbols = params["symbols"]
    date_initial = params["date_initial"]
    date_yesterday = Date.utc_today() |> Date.add(-1) |> Date.to_string()

    api_key = System.get_env("MARKETSTACK_API_KEY")
    IO.inspect(symbols)

    # First request with date_to as both date_from and date_to
    url_to_to =
      "http://api.marketstack.com/v1/eod" <>
        "?access_key=#{api_key}" <>
        "&symbols=#{symbols}" <>
        "&date_from=#{date_initial}" <>
        "&date_to=#{date_initial}"

    adj_close_intitial = make_request(url_to_to)

    # Second request with date_from as both date_from and date_to
    url_from_from =
      "http://api.marketstack.com/v1/eod" <>
        "?access_key=#{api_key}" <>
        "&symbols=#{symbols}" <>
        "&date_from=#{date_yesterday}" <>
        "&date_to=#{date_yesterday}"

    adj_close_yesterday = make_request(url_from_from)

    # Combine the results
    case {adj_close_intitial, adj_close_yesterday} do
      {{:ok, adj_close_intitial}, {:ok, adj_close_yesterday}} ->
        combined_data = %{
          initial_data: adj_close_intitial,
          yesterday_data: adj_close_yesterday
        }

        json(conn, combined_data)

      _ ->
        send_resp(conn, 500, "Failed to fetch data")
    end
  end

  defp make_request(url) do
    case HTTPoison.get(url) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} when is_binary(body) ->
        {:ok, parse_adj_close(body)}

      {:error, %HTTPoison.Error{reason: reason}} ->
        {:error, reason}
    end
  end

  def parse_adj_close(json_string) do
    case Jason.decode(json_string) do
      {:ok, %{"data" => data}} when is_list(data) ->
        Enum.map(data, fn item ->
          case item do
            %{"symbol" => symbol, "adj_close" => adj_close} ->
              {:ok, [symbol, adj_close]}

            _ ->
              IO.puts(
                "Error: Item does not contain required keys 'symbol' and 'adj_close': #{inspect(item)}"
              )

              {:error, :invalid_data_structure}
          end
        end)
        |> Enum.filter(&match?({:ok, _}, &1))
        |> Enum.map(fn {:ok, value} -> value end)

      {:error, reason} ->
        IO.puts("Error decoding JSON: #{inspect(reason)}")
        []

      _ ->
        IO.puts("Unexpected data format or missing 'data' key")
        []
    end
  end
end
