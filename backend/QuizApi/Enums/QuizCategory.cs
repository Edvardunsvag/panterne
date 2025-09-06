namespace QuizApi.Models;

/// <summary>
/// Available quiz categories
/// </summary>
public static class QuizCategory
{
    public const string GeneralKnowledge = "General Knowledge";
    public const string Science = "Science";
    public const string History = "History";
    public const string Geography = "Geography";
    public const string Entertainment = "Entertainment";
    public const string Sports = "Sports";
    public const string CapitalsOfEurope = "Name of the Capitals of Europe";
    public const string AmericanPresidents = "American Presidents";

    /// <summary>
    /// All available categories
    /// </summary>
    public static readonly string[] All = 
    {
        GeneralKnowledge,
        Science,
        History,
        Geography,
        Entertainment,
        Sports,
        CapitalsOfEurope,
        AmericanPresidents
    };
}